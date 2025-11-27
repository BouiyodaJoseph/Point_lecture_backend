import { PublicationSummaryDto } from './publication-summary.dto';

export class ReadingPageDto {
  establishmentName: string;
  publications: PublicationSummaryDto[];
}