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
  logo?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type DevelopmentResponse = {
  __typename?: 'DevelopmentResponse';
  development?: Maybe<Developments>;
  errors?: Maybe<Array<FieldError>>;
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
  createDevelopment: DevelopmentResponse;
  createOwner: OwnerResponse;
  createProperty: PropertyRentalResponse;
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
  email: Scalars['String'];
  name: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
};

export type OwnerResponse = {
  __typename?: 'OwnerResponse';
  errors?: Maybe<Array<FieldError>>;
  owner?: Maybe<Owner>;
};

export type PropertyInput = {
  album?: InputMaybe<Scalars['String']>;
  designation: Scalars['String'];
  developmentId: Scalars['Float'];
  notes?: InputMaybe<Scalars['String']>;
  ownerId: Scalars['Float'];
};

export type PropertyRental = {
  __typename?: 'PropertyRental';
  album: Scalars['String'];
  createdAt: Scalars['String'];
  designation: Scalars['String'];
  development: Developments;
  developmentId: Scalars['Int'];
  id: Scalars['Int'];
  notes: Scalars['String'];
  owner: Owner;
  ownerId: Scalars['Int'];
  updatedAt: Scalars['String'];
};

export type PropertyRentalResponse = {
  __typename?: 'PropertyRentalResponse';
  errors?: Maybe<Array<FieldError>>;
  propertyRental?: Maybe<PropertyRental>;
};

export type Query = {
  __typename?: 'Query';
  development?: Maybe<Developments>;
  developmentProperties: Array<PropertyRental>;
  developments: Array<Developments>;
  hello: Scalars['String'];
  me?: Maybe<User>;
  owner?: Maybe<Owner>;
  ownerProperties: Array<PropertyRental>;
  owners: Array<Owner>;
  properties: Array<PropertyRental>;
  property?: Maybe<PropertyRental>;
};


export type QueryDevelopmentArgs = {
  id: Scalars['Int'];
};


export type QueryDevelopmentPropertiesArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  limit: Scalars['Int'];
};


export type QueryDevelopmentsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryOwnerArgs = {
  id: Scalars['Int'];
};


export type QueryOwnerPropertiesArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  limit: Scalars['Int'];
};


export type QueryOwnersArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryPropertiesArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
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

export type CreateDevelopmentMutationVariables = Exact<{
  name: Scalars['String'];
  location: Scalars['String'];
  logo?: InputMaybe<Scalars['String']>;
}>;


export type CreateDevelopmentMutation = { __typename?: 'Mutation', createDevelopment: { __typename?: 'DevelopmentResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, development?: { __typename?: 'Developments', id: number, name: string, location: string } | null } };

export type CreateOwnerMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
}>;


export type CreateOwnerMutation = { __typename?: 'Mutation', createOwner: { __typename?: 'OwnerResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, owner?: { __typename?: 'Owner', id: number, name: string, email: string, phone: string } | null } };

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

export type DevelopmentQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DevelopmentQuery = { __typename?: 'Query', development?: { __typename?: 'Developments', name: string, location: string } | null };

export type DevelopmentPropertiesQueryVariables = Exact<{
  id: Scalars['Int'];
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type DevelopmentPropertiesQuery = { __typename?: 'Query', developmentProperties: Array<{ __typename?: 'PropertyRental', id: number, designation: string, ownerId: number, developmentId: number, album: string, notes: string, owner: { __typename?: 'Owner', name: string }, development: { __typename?: 'Developments', name: string } }> };

export type DevelopmentsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type DevelopmentsQuery = { __typename?: 'Query', developments: Array<{ __typename?: 'Developments', id: number, createdAt: string, name: string, location: string }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, email: string } | null };

export type OwnerQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type OwnerQuery = { __typename?: 'Query', owner?: { __typename?: 'Owner', name: string, email: string, phone: string } | null };

export type OwnerPropertiesQueryVariables = Exact<{
  id: Scalars['Int'];
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type OwnerPropertiesQuery = { __typename?: 'Query', ownerProperties: Array<{ __typename?: 'PropertyRental', id: number, designation: string, ownerId: number, developmentId: number, album: string, notes: string, owner: { __typename?: 'Owner', name: string }, development: { __typename?: 'Developments', name: string } }> };

export type OwnersQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type OwnersQuery = { __typename?: 'Query', owners: Array<{ __typename?: 'Owner', id: number, createdAt: string, name: string, email: string, phone: string }> };

export type PropertiesQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type PropertiesQuery = { __typename?: 'Query', properties: Array<{ __typename?: 'PropertyRental', id: number, designation: string, ownerId: number, developmentId: number, album: string, notes: string, owner: { __typename?: 'Owner', name: string }, development: { __typename?: 'Developments', name: string } }> };

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
export const CreateDevelopmentDocument = gql`
    mutation CreateDevelopment($name: String!, $location: String!, $logo: String) {
  createDevelopment(input: {name: $name, location: $location, logo: $logo}) {
    errors {
      ...RegularError
    }
    development {
      id
      name
      location
    }
  }
}
    ${RegularErrorFragmentDoc}`;

export function useCreateDevelopmentMutation() {
  return Urql.useMutation<CreateDevelopmentMutation, CreateDevelopmentMutationVariables>(CreateDevelopmentDocument);
};
export const CreateOwnerDocument = gql`
    mutation CreateOwner($name: String!, $email: String!, $phone: String) {
  createOwner(options: {name: $name, email: $email, phone: $phone}) {
    errors {
      ...RegularError
    }
    owner {
      id
      name
      email
      phone
    }
  }
}
    ${RegularErrorFragmentDoc}`;

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
export const DevelopmentDocument = gql`
    query Development($id: Int!) {
  development(id: $id) {
    name
    location
  }
}
    `;

export function useDevelopmentQuery(options: Omit<Urql.UseQueryArgs<DevelopmentQueryVariables>, 'query'>) {
  return Urql.useQuery<DevelopmentQuery>({ query: DevelopmentDocument, ...options });
};
export const DevelopmentPropertiesDocument = gql`
    query DevelopmentProperties($id: Int!, $limit: Int!, $cursor: String) {
  developmentProperties(id: $id, limit: $limit, cursor: $cursor) {
    id
    designation
    ownerId
    owner {
      name
    }
    developmentId
    development {
      name
    }
    album
    notes
  }
}
    `;

export function useDevelopmentPropertiesQuery(options: Omit<Urql.UseQueryArgs<DevelopmentPropertiesQueryVariables>, 'query'>) {
  return Urql.useQuery<DevelopmentPropertiesQuery>({ query: DevelopmentPropertiesDocument, ...options });
};
export const DevelopmentsDocument = gql`
    query Developments($limit: Int!, $cursor: String) {
  developments(limit: $limit, cursor: $cursor) {
    id
    createdAt
    name
    location
  }
}
    `;

export function useDevelopmentsQuery(options: Omit<Urql.UseQueryArgs<DevelopmentsQueryVariables>, 'query'>) {
  return Urql.useQuery<DevelopmentsQuery>({ query: DevelopmentsDocument, ...options });
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
export const OwnerPropertiesDocument = gql`
    query OwnerProperties($id: Int!, $limit: Int!, $cursor: String) {
  ownerProperties(id: $id, limit: $limit, cursor: $cursor) {
    id
    designation
    ownerId
    owner {
      name
    }
    developmentId
    development {
      name
    }
    album
    notes
  }
}
    `;

export function useOwnerPropertiesQuery(options: Omit<Urql.UseQueryArgs<OwnerPropertiesQueryVariables>, 'query'>) {
  return Urql.useQuery<OwnerPropertiesQuery>({ query: OwnerPropertiesDocument, ...options });
};
export const OwnersDocument = gql`
    query Owners($limit: Int!, $cursor: String) {
  owners(limit: $limit, cursor: $cursor) {
    id
    createdAt
    name
    email
    phone
  }
}
    `;

export function useOwnersQuery(options: Omit<Urql.UseQueryArgs<OwnersQueryVariables>, 'query'>) {
  return Urql.useQuery<OwnersQuery>({ query: OwnersDocument, ...options });
};
export const PropertiesDocument = gql`
    query Properties($limit: Int!, $cursor: String) {
  properties(limit: $limit, cursor: $cursor) {
    id
    designation
    ownerId
    owner {
      name
    }
    developmentId
    development {
      name
    }
    album
    notes
  }
}
    `;

export function usePropertiesQuery(options: Omit<Urql.UseQueryArgs<PropertiesQueryVariables>, 'query'>) {
  return Urql.useQuery<PropertiesQuery>({ query: PropertiesDocument, ...options });
};