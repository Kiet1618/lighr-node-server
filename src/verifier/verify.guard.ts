import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";
import { Observable } from "rxjs";
import { NOT_SUPPORT } from "src/common/message";
import { GoogleVerifier } from "./google.verifier";

@Injectable()
export class VerifyGuard implements CanActivate {
  constructor(private readonly googleVerifier: GoogleVerifier) {}
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { verifier, idToken, email } = request.body;

    if (verifier !== "google") {
      throw new BadRequestException(NOT_SUPPORT);
    }

    return this.googleVerifier.verify(idToken, email);
  }
}
