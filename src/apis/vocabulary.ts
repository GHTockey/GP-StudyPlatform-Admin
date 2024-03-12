import type { Vocabulary } from "@/types/Vocabulary";
import { request } from "@/utils/request";

// let cloudServiceURL = '/vocabulary-service';
let cloudServiceURL = '';

export class VocabularyAPI {
   /* 获取词集列表 API */
   static getVocabularyList() {
      return request<Vocabulary[]>(`${cloudServiceURL}/vocabulary/list`);
   }
   /* 添加词集 API */
   static addVocabulary(vocabulary: Vocabulary) {
      return request(`${cloudServiceURL}/vocabulary`, `POST`, vocabulary);
   }
   /* 删除词集 API */
   static delVocabulary(id: number | string) {
      return request(`${cloudServiceURL}/vocabulary/` + id, 'DELETE');
   }
   /* 修改词集 API */
   static updVocabulary(vocabulary: Vocabulary) {
      return request(`${cloudServiceURL}/vocabulary`, 'PUT', vocabulary);
   }
   /* 获取词集详情 API */
   static getVocabularyById(id: number | string) {
      return request<Vocabulary>(`${cloudServiceURL}/vocabulary/` + id);
   }
   /* 获取学习最多的词集列表 按数量排序 */
   static getMostStudyVocList() {
      return request<Vocabulary[]>(`${cloudServiceURL}/vocabulary/most`, 'GET')
   }
}