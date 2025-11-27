import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminToken: string;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    // Surcharge la variable d'environnement AVANT l'import de AppModule
    process.env.DATABASE_NAME = process.env.DATABASE_TEST_NAME || 'ekiosque_partners_test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    dataSource = app.get(DataSource);
    userRepository = dataSource.getRepository(User);
  });

  beforeEach(async () => {
    // Nettoie la BDD avant chaque test pour l'isolation
    await dataSource.synchronize(true);

    // Crée l'utilisateur admin nécessaire pour les tests d'authentification
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userRepository.save(userRepository.create({
        name: 'Super Admin',
        email: 'admin@ekiosque.com',
        password: hashedPassword,
        role: 'ROLE_ADMIN',
    }));
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('should run the full admin workflow', async () => {
    const appServer = app.getHttpServer();

    // 1. Se connecter en tant qu'Admin pour obtenir un token
    const loginResponse = await request(appServer)
      .post('/api/v1/partner/auth/login')
      .send({ email: 'admin@ekiosque.com', password: 'admin123' });
    
    // Un login réussi est un 200 OK
    expect(loginResponse.status).toBe(HttpStatus.OK);
    adminToken = loginResponse.body.token;
    expect(adminToken).toBeDefined();

    // 2. Créer un partenaire en utilisant le token d'admin
    const partnerDto = { name: 'Test Partner', email: 'partner.test@ekiosque.com', password: 'password123', role: 'ROLE_PARTNER' };
    const partnerResponse = await request(appServer)
        .post('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(partnerDto);
    
    expect(partnerResponse.status).toBe(HttpStatus.CREATED);
    const partnerId = partnerResponse.body.id;
    expect(partnerId).toBeDefined();

    // 3. Créer un Établissement pour ce partenaire
    const establishmentDto = {
        name: 'Test Establishment',
        latitude: 10,
        longitude: 10,
        geofenceRadius: 100,
        partnerId: partnerId,
    };

    const establishmentResponse = await request(appServer)
      .post('/api/v1/admin/establishments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(establishmentDto);

    expect(establishmentResponse.status).toBe(HttpStatus.CREATED);
    expect(establishmentResponse.body).toEqual(expect.objectContaining({
        name: 'Test Establishment',
        partnerId: partnerId,
    }));
  });
});