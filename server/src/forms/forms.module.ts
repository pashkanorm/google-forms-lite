import { Module } from '@nestjs/common';
import { FormsResolver } from './forms.resolver';

@Module({
  providers: [FormsResolver],
  exports: [FormsResolver],   
})
export class FormsModule {}