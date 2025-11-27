import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity'; // <-- CHEMIN CORRIGÉ
//import { Notification } from '../../notifications/entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  // Équivalent de findTop10ByUser_IdAndIsReadFalseOrderByCreatedAtDesc
  findUnreadForUser(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: {
        user: { id: userId },
        isRead: false,
      },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
        where: { id: notificationId },
        relations: { user: true }
    });

    // Sécurité : vérifier que la notif appartient bien à l'utilisateur
    if (!notification || (await notification.user).id !== userId) {
      throw new ForbiddenException('Accès non autorisé à cette notification.');
    }

    notification.isRead = true;
    await this.notificationRepository.save(notification);
  }
}