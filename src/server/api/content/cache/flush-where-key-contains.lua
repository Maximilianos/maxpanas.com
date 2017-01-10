-- Redis Lua script to delete any entries from cache that
-- contain the given strings in their keys

local prefix = ARGV[1] .. '*'

for i = 2, #ARGV do
  for _,key in pairs(redis.call('keys', prefix .. ARGV[i] .. '*')) do
    redis.call('del', key)
  end
end
