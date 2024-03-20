import { IsNotEmpty } from "class-validator";

export class UploadPaymentImageDto {
    @IsNotEmpty()
    paymentImage: string;
  }