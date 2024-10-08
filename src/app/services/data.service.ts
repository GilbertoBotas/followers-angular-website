import { Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { BadInput } from '../common/bad-input';
import { NotFoundError } from '../common/not-found-error';
import { AppError } from '../common/app-error';

export class DataService {

  constructor(private url: string, private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.url).pipe(catchError(this.handleError));
  }

  create(resource: any) {
    return this.http
      .post(this.url, JSON.stringify(resource))
      .pipe(catchError(this.handleError));
  }

  update(resource: any) {
    return this.http
      .patch(this.url + '/' + resource.id, JSON.stringify({ isRead: true }))
      .pipe(catchError(this.handleError));
  }

  delete(id: number) {
    return this.http
      .delete(this.url + '/' + id)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: Response) {
    if (error.status === 400) return throwError(() => new BadInput(error));

    if (error.status === 404) return throwError(() => new NotFoundError(error));

    return throwError(() => new AppError(error));
  }
}
