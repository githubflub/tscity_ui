declare module "lib/schema/ChatSettings/typedef" {
    import { BaseEntity } from 'typeorm';
    export class ChatSettings extends BaseEntity {
        user_id: string;
        primary_room: string;
        startup_rooms: number[];
        startup_no_room: boolean;
        constructor(data: Partial<ChatSettings>);
    }
}
declare module "lib/schema/TSBaseEntity/typedef" {
    import { BaseEntity } from 'typeorm';
    export abstract class TSBaseEntity extends BaseEntity {
        create_time: Date;
        update_time: Date;
        created_by: string;
        updated_by: string;
    }
}
declare module "lib/schema/FriendRequest/typedef" {
    import { TSBaseEntity } from "lib/schema/TSBaseEntity/typedef";
    export class FriendRequest extends TSBaseEntity {
        id: number;
        target_username: string;
        sender_username: string;
        constructor(data: Partial<FriendRequest>);
    }
}
declare module "lib/schema/MessageSystem/typedef" {
    export class SystemMessage {
        system_message: true;
        content: string;
    }
}
declare module "lib/auth/groups" {
    const Groups: {
        'Admin': string;
        'System': string;
        'User': string;
        'Owner': string;
    };
    export default Groups;
}
declare module "lib/auth/authorizers/authorizeAccess" {
    export function authorizeAccess(request_body: any, requester_identity: any, allowed_roles: any, type?: string): boolean;
}
declare module "lib/schema/user/logic/get" {
    import { User } from "lib/schema/user/typedef";
    export function getUser(username: any): Promise<User>;
}
declare module "interface/graphql/setGraphQlContext" {
    import { APIGatewayProxyEvent, Context } from "aws-lambda";
    export interface GraphQLContext extends Context {
        requester_identity: object;
    }
    export function setGraphQlContext({ event, context }: {
        event: APIGatewayProxyEvent;
        context: Context;
    }): Promise<GraphQLContext>;
}
declare module "lib/auth/typegraphql_decorators/FieldAuthGuard" {
    export function FieldAuthGuard(roles?: string | string[]): MethodDecorator | any;
}
declare module "lib/schema/user/typedef" {
    import { UserGroup } from "lib/schema/UserGroup/typedef";
    import { TSBaseEntity } from "lib/schema/TSBaseEntity/typedef";
    export class User extends TSBaseEntity {
        id: number;
        username: string;
        display_name: string;
        full_name?: string;
        given_name?: string;
        email?: string;
        email_verified?: boolean;
        phone_number?: string;
        phone_verified?: boolean;
        groups?: UserGroup[];
        constructor(data: Partial<User>);
    }
}
declare module "lib/schema/UserGroup/typedef" {
    import { BaseEntity } from 'typeorm';
    import { User } from "lib/schema/user/typedef";
    export class UserGroup extends BaseEntity {
        id: number;
        context: string;
        context_id: number;
        group: string;
        active?: boolean;
        start_time?: Date;
        end_time?: Date;
        user_id: number;
        user: Promise<User>;
        constructor(data: Partial<UserGroup>);
    }
}
declare module "lib/schema/message/typedef" {
    import { BaseEntity } from 'typeorm';
    import { UserGroup } from "lib/schema/UserGroup/typedef";
    export class MessageSenderType {
        id: string;
        username: string;
        display_name: string;
        groups: UserGroup[];
    }
    export class Message extends BaseEntity {
        id: number;
        sender: MessageSenderType;
        thread_id: string;
        send_time: Date;
        content: string;
        constructor(data: Partial<Message>);
    }
}
declare module "lib/schema/MessageUnion/typedef" {
    import { Message } from "lib/schema/message/typedef";
    import { SystemMessage } from "lib/schema/MessageSystem/typedef";
    export const MessageUnion: SystemMessage | Message;
}
declare module "lib/schema/Profile/typedef" {
    import { BaseEntity } from 'typeorm';
    import { profile_privacy_options } from "../node_modules/@tscity/shared/profile_visibility";
    export class Profile extends BaseEntity {
        id: number;
        user_id: number;
        username?: string;
        about_me: string;
        visibility: keyof typeof profile_privacy_options;
        constructor(data: Partial<Profile>);
        static getRedactableKeys(): string[];
    }
}
declare module "lib/schema/ThreadSilence/typedef" {
    import { BaseEntity } from 'typeorm';
    export class ThreadSilence extends BaseEntity {
        thread_id: string;
        user_id: string;
        expires: Date;
        reason: string;
        silenced_by: string;
        constructor(data: Partial<ThreadSilence>);
    }
}
declare module "lib/schema/chat_connection/typedef" {
    import { BaseEntity } from 'typeorm';
    export class ChatConnection extends BaseEntity {
        id: string;
        connection_id: string;
        user_id: number;
        subscribed_threads: number[];
        constructor(data: Partial<ChatConnection>);
    }
}
declare module "lib/schema/user/roles" {
    export type UserRoleType = 'Moderator' | 'Subscriber';
    const Roles: {
        'Moderator': string;
        'Subscriber': string;
    };
    export default Roles;
}
declare module "lib/schema/thread/post_modes" {
    export type PostModeType = 'sub_only' | 'Slow';
    const PostMode: {
        'SubscriberOnly': string;
        'Slow': string;
    };
    export default PostMode;
}
declare module "lib/schema/thread/typedef" {
    import { BaseEntity } from 'typeorm';
    import { UserRoleType } from "lib/schema/user/roles";
    import { PostModeType } from "lib/schema/thread/post_modes";
    export class Thread extends BaseEntity {
        id: string;
        display_name: string;
        description: string;
        access_groups: UserRoleType[];
        access_users: number[];
        room: boolean;
        primary_room: boolean;
        startup_room: boolean;
        participant_ids: number[];
        enabled: boolean;
        post_mode: PostModeType[];
        constructor(data: Partial<Thread>);
    }
}
