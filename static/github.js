const username = "LuisSante";
const url = `https://api.github.com/users/${username}`;
console.log(url);

export async function load({ fetch }) {
  const res = await fetch(url);
  const user = await res.json();

  return {
    props: {
      user
    }
  };
}