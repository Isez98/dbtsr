import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type DevelopmentInput = {
  location: Scalars['String'];
  logo: Scalars['String'];
  name: Scalars['String'];
};

export type Developments = {
  __typename?: 'Developments';
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  location: Scalars['String'];
  logo: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type EmailAndPasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  createDevelopment: Developments;
  createProperty: PropertyRental;
  deleteDevelopment: Scalars['Boolean'];
  deleteProperty: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  updateProperty?: Maybe<PropertyRental>;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreateDevelopmentArgs = {
  input: DevelopmentInput;
};


export type MutationCreatePropertyArgs = {
  input: PropertyInput;
};


export type MutationDeleteDevelopmentArgs = {
  id: Scalars['Float'];
};


export type MutationDeletePropertyArgs = {
  id: Scalars['Float'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  options: EmailAndPasswordInput;
};


export type MutationRegisterArgs = {
  options: EmailAndPasswordInput;
};


export type MutationUpdatePropertyArgs = {
  designation: Scalars['String'];
  id: Scalars['Float'];
};

export type PropertyInput = {
  album: Scalars['String'];
  designation: Scalars['String'];
  notes: Scalars['String'];
};

export type PropertyRental = {
  __typename?: 'PropertyRental';
  album: Scalars['String'];
  cleaningFee: Scalars['Float'];
  completeRentControl: Scalars['Boolean'];
  createdAt: Scalars['String'];
  deposit: Scalars['Float'];
  designation: Scalars['String'];
  extraGuestRate: Scalars['Float'];
  holidayRate: Scalars['Float'];
  id: Scalars['Int'];
  maxPeople: Scalars['Int'];
  nightRate: Scalars['Float'];
  notes: Scalars['String'];
  ownerId: Scalars['Int'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  development?: Maybe<Developments>;
  developments: Array<Developments>;
  hello: Scalars['String'];
  me?: Maybe<User>;
  properties: Array<PropertyRental>;
  property?: Maybe<PropertyRental>;
};


export type QueryDevelopmentArgs = {
  id: Scalars['Int'];
};


export type QueryPropertyArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Int'];
  updatedAt: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, email: string } | null } };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, email: string } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, email: string } | null };


export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(options: {email: $email, password: $password}) {
    errors {
      field
      message
    }
    user {
      id
      email
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!) {
  register(options: {email: $email, password: $password}) {
    errors {
      field
      message
    }
    user {
      id
      email
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    id
    email
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};