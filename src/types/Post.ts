export interface Post {
    id: number,
    text: string
}

export interface Comments {
    id: number,
    text: string,
    postID: number
}