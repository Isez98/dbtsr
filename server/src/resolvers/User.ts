import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Resolver,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { getConnection } from "typeorm";

@InputType()
class EmailAndPasswordInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Length must be greater than 2",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User no longer exists",
          },
        ],
      };
    }

    await User.update(
      { id: userIdNum },
      {
        password: await argon2.hash(newPassword),
      }
    );

    await redis.del(key);

    // log in user after changing password.
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // email is not in dataabse
      return true;
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); // 3 days

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );

    return true;
  }

  // @Query(() => [User])
  // users(@Ctx() { em }: MyContext): Promise<User[]> {
  //   return em.find(User, {});
  // }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // You are not logged in
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: EmailAndPasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (options.email.length <= 5) {
      return {
        errors: [
          {
            field: "email",
            message: "Email input field should be greater than five characters",
          },
        ],
      };
    }
    if (options.password.length <= 5) {
      return {
        errors: [
          {
            field: "password",
            message:
              "Password input field should be greater than five characters",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      // Insert manual SQL
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          email: options.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (error) {
      if (error.code === "23505") {
        return {
          errors: [
            {
              field: "email",
              message: "Email already exists",
            },
          ],
        };
      }
    }

    // Store user ID session
    // this will set a cookie on the user
    // basically keep them logged in
    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: EmailAndPasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email: options.email } });
    if (!user) {
      return {
        // Return to change error handling to "Error in the email/password input"
        errors: [
          {
            field: "email",
            message: "email doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    }

    req.session!.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
