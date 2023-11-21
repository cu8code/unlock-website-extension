
type QuestionAns = {
    question: string
    ans: string
}

const getType = (e: number) => {
    if (e === 1) {
        return "+"
    }
    if (e === 2) {
        return "-"
    }
    if (e === 3) {
        return "/"
    }
    if (e === 4) {
        return "*"
    }
    return "-"
}

const cal = (a:number,b:number,e: number) => {
    if (e === 1) {
        return a + b
    }
    if (e === 2) {
        return a -b
    }
    if (e === 3) {
        return a / b
    }
    if (e === 4) {
        return a * b
    }
    return a - b
}

const getQuestion = () => {
    const one = Math.floor(Math.random() * 100)
    const two = Math.floor(Math.random() * 100)
    const operation = Math.floor(Math.random() * 10) % 4

    return {
        question: `${one} ${getType(operation)} ${two}`,
        ans: cal(one,two,operation)
    }
}

const q = getQuestion()
console.log(q);

const question = document.querySelector("div")
const ans = document.querySelector("input")
const button = document.querySelector("button")
const textarea = document.querySelector("textarea")
const label = document.querySelector("label")
if (!ans) {
    throw new Error("textarea not found")
}
if (!button) {
    throw new Error("button not found");
}
if (!question) {
    throw new Error("no question div found")
}
// if(!label){
//     throw new Error("label not found");
// }
// if(!textarea){
//     throw new Error("no input are");
// }
question.innerHTML = `
    <h1>${q.question}</h1>
`
ans.focus()

button.addEventListener("click", (e) => {
    console.log("LOG: button clicked", ans.value);

    if (ans.value === `${q.ans}`) {
        console.log("LOG: message sent");
        chrome.runtime.sendMessage("ok")
    }

    // const runTemplate = `
    // ${textarea.innerText}
    // const m = main(1,2)
    // exports.msg = m
    // `
    // const o = inter.exports as {m:number}
    // if(3 === o.m){
    //     console.log("LOG: message sent");
    //     chrome.runtime.sendMessage("ok")
    // }
})

// label.textContent = `
//     sum of two number
// `
// textarea.innerText = `
//     function main(a,b){
//        // code
//     }
// `
