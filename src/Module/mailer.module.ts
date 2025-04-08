import { Module } from '@nestjs/common';
import { MailerService } from 'src/Services/mailer.service';


@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
