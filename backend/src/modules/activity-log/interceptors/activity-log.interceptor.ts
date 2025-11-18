import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivityLogService } from '../activity-log.service';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(private readonly activityLogService: ActivityLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url, body, ip, headers } = request;

    // Skip logging for GET requests (optional)
    if (method === 'GET') {
      return next.handle();
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (response) => {
          const duration = Date.now() - startTime;
          
          if (user) {
            const action = this.getActionFromMethod(method);
            const module = this.getModuleFromUrl(url);

            this.activityLogService.logActivity({
              user_id: user.sub,
              school_id: user.schoolId,
              action,
              module,
              description: `${action} ${module}`,
              ip_address: ip,
              user_agent: headers['user-agent'],
              request_data: this.sanitizeData(body),
              response_data: { status: 'success', duration },
              status: 'success',
            });
          }
        },
        error: (error) => {
          if (user) {
            const action = this.getActionFromMethod(method);
            const module = this.getModuleFromUrl(url);

            this.activityLogService.logActivity({
              user_id: user.sub,
              school_id: user.schoolId,
              action,
              module,
              description: `Failed to ${action} ${module}`,
              ip_address: ip,
              user_agent: headers['user-agent'],
              request_data: this.sanitizeData(body),
              status: 'failed',
              error_message: error.message,
            });
          }
        },
      }),
    );
  }

  private getActionFromMethod(method: string): string {
    const actionMap: Record<string, string> = {
      POST: 'create',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
      GET: 'view',
    };
    return actionMap[method] || 'unknown';
  }

  private getModuleFromUrl(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[2] || 'unknown'; // Assuming /api/v1/MODULE
  }

  private sanitizeData(data: any): any {
    if (!data) return {};
    
    const sanitized = { ...data };
    // Remove sensitive fields
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.secret;
    
    return sanitized;
  }
}
