export default class UpdateUserDTO {
  public readonly uuid: string;
  public readonly email?: string;
  public readonly password?: string;

  constructor(uuid: string, email?: string, password?: string) {
    this.uuid = uuid
    this.email = email;
    this.password = password;
  };
}