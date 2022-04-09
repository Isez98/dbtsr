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
  createOwner: Owner;
  createProperty: PropertyRental;
  deleteDevelopment: Scalars['Boolean'];
  deleteOWner: Scalars['Boolean'];
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


export type MutationCreateOwnerArgs = {
  options: OwnerInput;
};


export type MutationCreatePropertyArgs = {
  input: PropertyInput;
};


export type MutationDeleteDevelopmentArgs = {
  id: Scalars['Float'];
};


export type MutationDeleteOWnerArgs = {
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

export type Owner = {
  __typename?: 'Owner';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  phone: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type OwnerInput = {
  email?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
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
  owner?: Maybe<Owner>;
  owners: Array<Owner>;
  properties: Array<PropertyRental>;
  property?: Maybe<PropertyRental>;
};


export type QueryDevelopmentArgs = {
  id: Scalars['Int'];
};


export type QueryOwnerArgs = {
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

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularUserResponseFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, email: string } | null };

export type _UserFragment = { __typename?: 'User', id: number, email: string };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, email: string } | null } };

export type CreateOwnerMutationVariables = Exact<{
  name: Scalars['String'];
  email?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
}>;


export type CreateOwnerMutation = { __typename?: 'Mutation', createOwner: { __typename?: 'Owner', id: number, name: string, email: string, phone: string } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, email: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, email: string } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, email: string } | null };

export type OwnerQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type OwnerQuery = { __typename?: 'Query', owner?: { __typename?: 'Owner', name: string, email: string, phone: string } | null };

export type OwnersQueryVariables = Exact<{ [key: string]: never; }>;


export type OwnersQuery = { __typename?: 'Query', owners: Array<{ __typename?: 'Owner', id: number, name: string, email: string, phone: string }> };

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const _UserFragmentDoc = gql`
    fragment _User on User {
  id
  email
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ..._User
  }
}
    ${RegularErrorFragmentDoc}
${_UserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreateOwnerDocument = gql`
    mutation CreateOwner($name: String!, $email: String, $phone: String) {
  createOwner(options: {name: $name, email: $email, phone: $phone}) {
    id
    name
    email
    phone
  }
}
    `;

export function useCreateOwnerMutation() {
  return Urql.useMutation<CreateOwnerMutation, CreateOwnerMutationVariables>(CreateOwnerDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(options: {email: $email, password: $password}) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!) {
  register(options: {email: $email, password: $password}) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ..._User
  }
}
    ${_UserFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const OwnerDocument = gql`
    query Owner($id: Int!) {
  owner(id: $id) {
    name
    email
    phone
  }
}
    `;

export function useOwnerQuery(options: Omit<Urql.UseQueryArgs<OwnerQueryVariables>, 'query'>) {
  return Urql.useQuery<OwnerQuery>({ query: OwnerDocument, ...options });
};
export const OwnersDocument = gql`
    query Owners {
  owners {
    id
    name
    email
    phone
  }
}
    `;

export function useOwnersQuery(options?: Omit<Urql.UseQueryArgs<OwnersQueryVariables>, 'query'>) {
  return Urql.useQuery<OwnersQuery>({ query: OwnersDocument, ...options });
};