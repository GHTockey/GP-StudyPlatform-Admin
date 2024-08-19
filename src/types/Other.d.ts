export type Status = "idle" | "loading" | "success" | "error" | "finished";
export type MyBatisPlusPage<T> = {
   countId: string,
   current: number,
   maxLimit: number,
   optimizeCountSql: true,
   orders: { asc: true, column: string }[],
   pages: number,
   records: T,
   searchCount: true,
   size: number,
   total: number
}

// 网站信息
export type Website = {
   id: number;
   logoUrl: string;
   name: string;
   info: string;
}