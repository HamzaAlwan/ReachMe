import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class PostsService {
  constructor(private http: HttpClient) {}

  createPost(body): Observable<any> {
    return this.http.post(`${environment.api}/post/create`, body);
  }

  likePost(post): Observable<any> {
    return this.http.post(`${environment.api}/post/like`, post);
  }

  unLikePost(post): Observable<any> {
    return this.http.post(`${environment.api}/post/unlike`, post);
  }

  addComment(post): Observable<any> {
    return this.http.post(`${environment.api}/post/comment`, post);
  }

  getPosts(): Observable<any> {
    return this.http.get(`${environment.api}/post/getAll`);
  }

  getPost(id): Observable<any> {
    return this.http.get(`${environment.api}/post/getPost/${id}`);
  }
}
