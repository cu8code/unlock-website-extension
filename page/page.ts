type QuestionAns = {
    question: string
    ans: string
}

const getQuestion = () => {
    const one = Math.floor(Math.random() * 10)
    const two = Math.floor(Math.random() * 10)
    return {
        question: `${one} + ${two}`,
        ans: one + two
    }
}

const q = getQuestion()
const question = document.querySelector("div")
const ans = document.querySelector("input")
const button = document.querySelector("button")
if (!ans) {
    throw new Error("textarea not found")
}
if (!button) {
    throw new Error("button not found");
}
if(!question){
    throw new Error("no question div found")
}
question.innerHTML = `
    <h1>${q.question}</h1>
`
ans.focus()

button.addEventListener("click", (e) => {
    console.log("LOG: button clicked",ans.value);

    if (ans.value === `${q.ans}`) {
        console.log("LOG: message sent");
        chrome.runtime.sendMessage("ok")
    }
})