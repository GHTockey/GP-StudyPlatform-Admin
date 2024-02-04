import type { Vocabulary } from "@/types/Vocabulary";
import { request } from "@/utils/request";

export class VocabularyAPI {
   /* 获取词集列表 API */
   static getVocabularyList() {
      return request<Vocabulary[]>('/vocabulary-service/vocabulary/list');
   }
   /* 添加词集 API */
   static addVocabulary(vocabulary: Vocabulary) {
      return request('/vocabulary-service/vocabulary', 'POST', vocabulary);
   }
   /* 删除词集 API */
   static delVocabulary(id: number | string) {
      return request('/vocabulary-service/vocabulary/' + id, 'DELETE');
   }
   /* 修改词集 API */
   static updVocabulary(vocabulary: Vocabulary) {
      return request('/vocabulary-service/vocabulary', 'PUT', vocabulary);
   }
   /* 获取词集详情 API */
   static getVocabularyById(id: number | string) {
      return request<Vocabulary>('/vocabulary-service/vocabulary/' + id);
   }
}