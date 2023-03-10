import { IsNotEmpty, IsString } from "class-validator";
import { Trim } from "../../../../main/helpers/decorator-trim";

export class DeviceIdDto {
  /**
   * deviceId: id session
   */
  @Trim()
  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
