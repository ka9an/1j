import go from 'https://esm.sh/4z'
import { json, serve } from "https://raw.githubusercontent.com/ka9an/1j/main/mod.ts"

var x =   {
            chat_id: 1875804439,

            text: "cokemonn",
            method: "sendmessage"
        }



// ( async () => {

// x = await go(11)


// console.log(JSON.stringify(x,null,4))
// })()

// serve({
//   "/": () => json(        {
//             chat_id: 1875804439,
          
//             text: "cokemonn",
//             method: "sendmessage"
//         }),
//   "api/create": () => json({ message: "created" }, { status: 201 }),
// })

serve({
  "/": async req => {
    if (req.method == "POST") {
      try {
        x.text = await req.json()
      } catch (err) {
        //x.text = err
        console.log(x)
      }
    }
    return json(x)
  }
})
