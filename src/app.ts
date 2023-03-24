import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { OpenAPIModule, Name } from 'deepkit-openapi';
import { http, HttpBody, HttpError } from '@deepkit/http';

interface User {
    id: number;
    name: string;
    password: string;
}

type CreateUser = Omit<User, 'id'>;
type UpdateUser = Partial<CreateUser> & Name<'UpdateUser'>;
type ReadUser = Omit<User, 'password'> & Name<'ReadUser'>;

const users: User[] = [
    { id: 1, name: 'chris', password: 'zekgjhzekg' },
    { id: 2, name: 'cassi', password: 'zekgjhzekg' }
];

@http.controller()
class UserController {
    @http
        .GET('/user/:id')
        .response<ReadUser>(200, 'Read a User by its ID')
        .response<Error>(404, 'User not found')
    read(id: ReadUser['id']) {
        const user = users.find(user => user.id === id);
        if (!user) throw new HttpError('User not found', 404);
        return user;
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

new App({
    controllers: [UserController],
    imports: [
        new OpenAPIModule({
            prefix: '/openapi/',
            title: 'The title of your APIs',
            description: 'The description of your APIs',
            version: 'x.y.z'
        }),
        new FrameworkModule({
            debug: true,
            port: 4000,
            publicDir: 'public',
            httpLog: true,
            migrateOnStartup: true
        })
    ]
})
    .loadConfigFromEnv()
    .run();
