let alertDOM = document.querySelector("#alert")
let todoList = document.querySelector('#todo-list')
let todoInput = document.querySelector('#todo-input')

let todoButton = document.querySelector('#todo-button')
todoButton.addEventListener("click", buttonFunction)

let todoFilter = document.querySelector('#todo-filter')

//let todos=['Evi topla', 'Çöpleri at','ve Saygınlık']



let getTodosToPage = ()=> {
    todos.forEach((todo) =>{
        createTodoItem(todo)
    })
}

let createTodoItem =(text) => {

    let todoItem = document.createElement('div');
    todoItem.classList.add('todo-item','todo');
    
    let todoItemLi = document.createElement('li')
    todoItemLi.innerHTML= text;
    
    let todoItemChech = document.createElement('i')
    todoItemChech.classList.add('fas','fa-square')
    todoItemChech.setAttribute('onclick','checkTodo(this)');

    let todoItemRemove = document.createElement('i')
    todoItemRemove.classList.add('fa','fa-trash-alt')
    todoItemRemove.setAttribute('onclick','removeTodo(this)');

    /* todoItem div'i içerisine listeler ve iconlar eklendi*/
    todoItem.appendChild(todoItemLi);
    todoItem.appendChild(todoItemChech);
    todoItem.appendChild(todoItemRemove);

    todoList.appendChild(todoItem);
}

let getDonesToPage = ()=> {
    dones.forEach((done) =>{
        createDoneItem(done)
    })
}

let createDoneItem =(text) => {

    let todoItem = document.createElement('div');
    todoItem.classList.add('todo-item','done');
    
    let todoItemLi = document.createElement('li')
    todoItemLi.innerHTML= text;
    
    let todoItemChech = document.createElement('i')
    todoItemChech.classList.add('fas','fa-check-square')
    todoItemChech.setAttribute('onclick','unCheckDone(this)');

    let todoItemRemove = document.createElement('i')
    todoItemRemove.classList.add('fa','fa-trash-alt')
    todoItemRemove.setAttribute('onclick','removeDone(this)');

    /* todoItem div'i içerisine listeler ve iconlar eklendi*/
    todoItem.appendChild(todoItemLi);
    todoItem.appendChild(todoItemChech);
    todoItem.appendChild(todoItemRemove);

    todoList.appendChild(todoItem);
}

window.addEventListener("load", ()=>{
    getTodosToPage()
    getDonesToPage()
})

function buttonFunction(){
    let input = todoInput.value;
   if(input) saveTodosToStorage(input)
   todoInput.value=""
}

let saveTodosToStorage = (todo) =>{
    todos.push(todo);
    localStorage.setItem('todos',JSON.stringify(todos))
    createTodoItem(todo)   // listeye  ekleme
}

let getTodosFromStorage = ()=>{
    let storage = JSON.parse(localStorage.getItem('todos'))
    return (storage) ? storage : [];


}

let getDonesFromStorage = ()=>{
    let storage = JSON.parse(localStorage.getItem('dones'))
    return (storage) ? storage : [];


}

let todos = getTodosFromStorage()
let dones = getDonesFromStorage()

// silme butonu


let removeTodo = (target) =>{
    let silenecekTodo = target.parentNode.childNodes[0].innerHTML // Element içerisindeki metni aldık
    removeTodoFromStorage(silenecekTodo);
     // animasyon ile soltaraftan tamamlanMAmışların silinmesini sağladı
     target.parentNode.classList.add("animate__animated","animate__slideOutLeft","animate__slower")
     target.parentNode.addEventListener("animationend",()=>{
         target.parentNode.remove() //silme yapan kısım
     })
 
}

let removeTodoFromStorage = (silenecekTodo) =>{
    const index = todos.indexOf(silenecekTodo)
    if(index > -1){
        todos.splice(index,1);
        localStorage.setItem("todos", JSON.stringify(todos)) // localstorege'dan siliyor bu sayede ekran yenilendiği anda tekrar gelmiyor
    }

} 

let removeDoneFromStorage = (checkedDone) =>{
    const index = dones.indexOf(checkedDone)
    if(index > -1){
        dones.splice(index,1);
        localStorage.setItem("dones", JSON.stringify(dones)) 
    }

} 

// chech butonu

let checkTodo = (target)=>{
    let tamamlanmısTodo = target.parentNode.childNodes[0].innerHTML;
    console.log(tamamlanmısTodo)
    moveTodoDone(tamamlanmısTodo, target)
}

let moveTodoDone = (tamamlanmısTodo, target) =>{
    removeTodoFromStorage(tamamlanmısTodo);
    dones.push(tamamlanmısTodo)
    localStorage.setItem('dones', JSON.stringify(dones))
    makeItDone(target)
}

let makeItDone= (target) =>{
    let tamamlananlar = target.parentNode.classList.add("done"); // done classı eklenerek css getirildi
    target.parentNode.classList.remove("todo");

    // tamamlananlardan çıkarmak için removeDone fonksiyonu kullanılacak
    let removeTamamlananlar = target.parentNode.childNodes[2].setAttribute("onclick","removeDone(this)") 
    target.className=''
    target.classList.add("fas","fa-check-square",)
    target.setAttribute("onclick","unCheckDone(this)")


}

let unCheckDone = (target) =>{
    let checkedDone = target.parentNode.childNodes[0].innerHTML
    moveDoneToTodos(checkedDone,target)
}

// tamamlanmış görevlerin tekrar chech yani yapılmadı olarak işaretlenmesini sağlıyor
let removeDone = (target) =>{
    let removedDone = target.parentNode.childNodes[0].innerHTML
    removeDoneFromStorage(removedDone)
    // animasyon ile soltaraftan tamamlanmışların silinmesini sağladı
    target.parentNode.classList.add("animate__animated","animate__slideOutLeft","animate__faster")
    target.parentNode.addEventListener("animationend",()=>{
        target.parentNode.remove() //silme yapan kısım
    })


}
let moveDoneToTodos = (checkedDone, target) =>{
    removeDoneFromStorage(checkedDone);
    todos.push(checkedDone)
    localStorage.setItem('todos',JSON.stringify(todos))
    makeItTodo(target);

}

let makeItTodo= (target) =>{
    target.parentNode.classList.add("todo"); /* todo classı eklenerek css getirildi*/ 
    target.parentNode.classList.remove("done");

    // tamamlananlardan çıkarmak için removeDone fonksiyonu kullanılacak
    let removeTamamlananlar = target.parentNode.childNodes[2].setAttribute("onclick","removeTodo(this)") 
    target.className=''
    target.classList.add("fas","fa-square",)
    target.setAttribute("onclick","checkTodo(this)")
}

// Enter ile ekleme yapmak için

todoInput.addEventListener('keyup',(event)=>{
    if(event.keyCode===13) todoButton.click();      // 13 enter'ın keyCode'u imiş
})


// filtreme işlemi

todoFilter.addEventListener("click", () =>{
        todoList.dataset.filter = (parseInt(todoList.dataset.filter)+1 ) % 3;
        listFilter()}
)

let listFilter = () =>{
    let items = todoList.getElementsByClassName("todo-item")
    let array = [].map.call(items, item => item);
    let filter = todoList.dataset.filter;

    array.forEach((item) =>{
       switch (filter) {
        case "0":
            todoFilter.className=""
            todoFilter.classList.add("far","fa-square")
            item.style.display="flex"
            break;
        case "1":
            todoFilter.className=""
            todoFilter.classList.add("far","fa-square")
            if(item.classList.contains("done")) item.style.display="none";
            else item.style.display="flex"
            break;
        case "2":
            todoFilter.className=""
            todoFilter.classList.add("far","fa-check-square")
            if(item.classList.contains("todo")) item.style.display="none";
            else item.style.display="flex"
            break;
    
        
        default:
            break;
       }
    })
}
