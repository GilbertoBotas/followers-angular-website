import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { NotFoundError } from 'rxjs';
import { BadInput } from '../common/bad-input';
import { AppError } from '../common/app-error';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  public posts: any = [];

  constructor(private service: PostService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (response) => {
        this.posts = response;
        console.log(response);
      },
    });
  }

  createPost(input: HTMLInputElement) {
    const post: any = { title: input.value };
    this.posts.splice(0, 0, post);

    this.service.create(post).subscribe({
      next: (response: any) => {
        post.id = response.id;
      },
      error: (error: AppError) => {
        this.posts.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(error.originalError);
        }
        else throw error;
      },
    });
  }

  updatePost(post: any) {
    this.service.update(post).subscribe({
      next: (response) => {
        console.log(response);
      }
    });
  }

  deletePost(post: any) {
    const index = this.posts.indexOf(post);
    this.posts.splice(index, 1);

    this.service.delete(post.id).subscribe({
      error: (error: AppError) => {
        this.posts.splice(index, 0, post);

        if (error instanceof NotFoundError) {
          alert('This post has already been deleted');
        }
        else throw error;
      },
    });
  }
}
