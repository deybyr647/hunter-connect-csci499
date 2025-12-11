export function buildCommentTree(list: any[]) {
  const map: any = {};
  list.forEach((c) => (map[c.id] = { ...c, replies: [] }));

  const rootComments: any[] = [];

  list.forEach((c) => {
    if (c.parentId) {
      map[c.parentId]?.replies.push(map[c.id]);
    } else {
      rootComments.push(map[c.id]);
    }
  });

  return rootComments;
}
