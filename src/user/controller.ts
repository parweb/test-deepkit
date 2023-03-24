import { http, HttpBody, HttpError } from '@deepkit/http';
import { Name } from 'deepkit-openapi';

interface User {
  id: number;
  name: string;
  password: string;
}

type CreateUser = Omit<User, 'id'>;
type UpdateUser = Partial<CreateUser> & Name<'UpdateUser'>;
type ReadUser = Omit<User, 'password'> & Name<'ReadUser'>;

const users: User[] = [
  { id: 1, name: 'yo', password: 'zekgjhzekg' },
  { id: 2, name: 'cassi', password: 'zekgjhzekg' }
];

@http.controller()
export class UserController {
  @http
    .GET('/user/:id')
    .name('get user')
    .description('get one users')
    .response<ReadUser>(200, 'Read a User by its ID')
    .response<Error>(404, 'User not found')
  read(id: ReadUser['id']) {
    const user = users.find(user => user.id === id);
    if (!user) throw new HttpError('User not found', 404);
    return user;
  }

  @http
    .GET('/user')
    .name('list user')
    .description('list all users')
    .response<ReadUser[]>(200, 'List all User')
  list() {
    return users;
  }

  @http.POST('/user').response<ReadUser>(200, 'Create a new User')
  create(user: HttpBody<CreateUser>) {
    users.push({ id: users.length + 1, ...user });
    return users.find(user => user.id === users.length - 1);
  }

  @http
    .PATCH('/user/:id')
    .response<ReadUser>(200, "Patch a User's attributes")
    .response<Error>(404, 'User not found')
  patch(id: number, patch: HttpBody<UpdateUser>) {
    const user = users.find(user => user.id === id);
    if (!user) throw new HttpError('User not found', 404);
    return { ...user, ...patch };
  }
}
