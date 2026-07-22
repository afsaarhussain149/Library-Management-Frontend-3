import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { toCamelCase } from '../utils/case.util';

/**
 * Java backend (raw SQL / AliasToEntityMapResultTransformer) JSON responses me
 * snake_case column names bhejta hai (user_id, full_name, payment_created_at,
 * wagera). Yeh interceptor har response body ko chupke se camelCase me badal
 * deta hai taaki frontend ka existing code (jo camelCase expect karta hai)
 * bina tooti hue chal sake. Request body ko chhedte nahi hain — Jackson
 * already camelCase JSON ko bean fields se seedha map kar leta hai.
 */
export function camelCaseInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && event.body && typeof event.body === 'object') {
        return event.clone({ body: toCamelCase(event.body) });
      }
      return event;
    })
  );
}
