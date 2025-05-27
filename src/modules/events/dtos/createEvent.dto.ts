import {
  IsString,
  IsNotEmpty,
  Length,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  capacity: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsDateString()
  @IsNotEmpty()
  registration_ends: string;
}