import { compare, hash } from "bcryptjs";

import { IHashProvider } from "../IHashProvider";

class BcryptProvider implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

export { BcryptProvider };
