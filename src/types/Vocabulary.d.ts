// 添加时的词集
// export type Vocabulary = {
//    authorId: string | number,
//    desc: string,
//    title: string,
//    cover: string,
//    wordsList: Word[]
// }
// 词集
export type Vocabulary = {
   id: string,
   title: string,
   desc: string,
   cover: string,
   count: number,
   authorId: string,
   createTime: string,
   updateTime: string,
   stuNum: number,
   // 关联
   wordsList?: Word[],
   author?: User,
   userList?: [] | User[],
}
// 词语
export type Word = {
   definition: string,
   word: string,
   id: number,
   vid: number | null
}