/** @format */

import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === 'development') return true;
    return super.shouldSkip(context);
  }
}
