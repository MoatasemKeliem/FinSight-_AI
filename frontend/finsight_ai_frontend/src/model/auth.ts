export interface IRegister {
    email: string,
    password: string,
    UserName: string,
    Role: "User",
}

export interface ILogin {
    email: string,
    password: string,
}