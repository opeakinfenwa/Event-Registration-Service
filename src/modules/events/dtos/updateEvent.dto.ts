import {
  IsString,
  IsOptional,
  Length,
  IsDateString,
  Min,
  IsInt,
} from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(10, 1000)
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsDateString()
  @IsOptional()
  registration_ends?: string;
}