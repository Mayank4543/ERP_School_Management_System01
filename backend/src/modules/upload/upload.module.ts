import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { CloudflareR2Service } from '../../common/services/cloudflare-r2.service';

@Module({
  controllers: [UploadController],
  providers: [CloudflareR2Service],
  exports: [CloudflareR2Service],
})
export class UploadModule {}