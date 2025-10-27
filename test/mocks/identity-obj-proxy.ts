const proxy: Record<string, string> = new Proxy(
  {},
  {
    get: (_target, property) => property.toString(),
  },
);

export default proxy;
