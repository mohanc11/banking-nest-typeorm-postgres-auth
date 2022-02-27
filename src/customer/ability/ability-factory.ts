import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { Auth, USER_ROLE } from '../../auth/entities/auth.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'Read',
  Update = 'Update',
  Delete = 'delete',
}
export type Subjects = InferSubjects<typeof Auth> | 'all'; //all contains all users loke manage

export type AppAbility = Ability<[Action, Subjects]>;
@Injectable()
export class AbilityFatory {
  defineAbility(auth: Auth) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    if (auth.user_role === USER_ROLE.ADMIN) {
      can(Action.Manage, Auth);
    } else {
      can(Action.Create, Auth);
      can(Action.Read, Auth);
      can(Action.Update, Auth);
      cannot(Action.Delete, Auth);
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
