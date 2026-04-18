
document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const emptyImage = document.querySelector('.emptyImage');
    const todoContainer = document.querySelector('.todoContainer');
    const progressBar = document.querySelector('#progressBar');
    const progressNumber = document.querySelector('#numbers');

    const EmptyImageToggle =()=>{
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todoContainer.style.width = taskList.children.length >0 ? "100%" : "50%";
    };

    const updateProgress =(checkCompletion = true)=>{
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%`: "0%";
        progressNumber.textContent = `${completedTasks} / ${totalTasks}`;
    }
    
    const saveTask =()=>{
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed : li.querySelector('.checkbox').checked
        }));
        localStorage.setItem("tasks",JSON.stringify(tasks)); 
    }
    const loadTasks =()=>{
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(({text,completed}) => addTask(text, completed, false));
        EmptyImageToggle();
        updateProgress();
    }

    const addTask=(text ,completed= false, checkCompletion = true)=>{
    
        const taskText = text || taskInput.value.trim();
        if(!taskText){
            return;
        }
        const li =document.createElement('li');
        li.innerHTML =`
        <input type="checkbox" class="checkbox"${completed ? "checked" : ""}/>
        <span>${taskText}</span>
        <div class="buttons">
            <button class="editBtn"><i class="fa-solid fa-pen"></i></button>
            <button class="deleteBtn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;
        const checkbox = li.querySelector(".checkbox");
        const editBtn = li.querySelector(".editBtn");
        if (completed){
            li.classList.add("completed");
            editBtn.disabled = true;
            editBtn.style.opacity = "0.5";
            editBtn.style.pointerEvents = "none";
        }
        checkbox.addEventListener("change",()=>{
            const isChecked = checkbox.checked;
            li.classList.toggle('completed',isChecked);
                editBtn.disabled = isChecked;
                editBtn.style.opacity = isChecked ? "0.5" : "1";
                editBtn.style.pointerEvents = isChecked ? "none" : "auto";
                updateProgress();
                saveTask();
        })
        editBtn.addEventListener("click",()=>{
            if(!checkbox.checked){
                taskInput.value = li.querySelector("span").textContent;
                li.remove();
                EmptyImageToggle();
                updateProgress(false);
                saveTask();
            }
        });
        li.querySelector(".deleteBtn").addEventListener("click",()=>{
            li.remove();
            EmptyImageToggle();
            updateProgress();
            saveTask();
        })
        taskList.appendChild(li);
        taskInput.value="";
        EmptyImageToggle();
        if(checkCompletion){
            updateProgress();
        }
    };
    addTaskButton.addEventListener('click', ()=> addTask());
    taskInput.addEventListener('keypress', (e)=>{
        if (e.key === "Enter"){
            e.preventDefault();
            addTask();
        }
    });
    loadTasks();
});