// 添加时的词集
export type Vocabulary = {
   authorId: string | undefined,
   desc: string,
   title: string,
   cover: string,
   wordsList: Word[]
}
// 词集详情
export type VocabularyData = {
   id: number,
   title: string,
   desc: string,
   cover: string,
   count: number,
   authorId: string,
   createTime: string,
   updateTime: string,
   wordsList: [] | Word[]
}
// 词语
export type Word = {
   definition: string,
   word: string,
   id: number,
   vid: number | null
}