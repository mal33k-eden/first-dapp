App = {
    loading: false,
    contracts:{}, 
    load: async ()=>{
        //load app
        await App.loadWeb3();  
        await App.loadAccount();  
        await App.loadContract();
        await App.render();
        console.log("app loading ")
    },
    //load web3js 
    loadWeb3: async()=>{
          var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
          App.web3 = web3;
    },
    loadAccount: async()=>{
        // App.web3.eth.getAccounts
         let a  = await (App.web3.eth.getAccounts());
         App.account = a[0];
    },
    loadContract: async()=>{
        //create a javascript version of the smart contract
        const todoList = await $.getJSON('TodoList.json');
        App.contracts.TodoList = TruffleContract(todoList);
        App.contracts.TodoList.setProvider(App.web3.currentProvider);
        //pull live contract data from blockchain 
        App.todoList = await App.contracts.TodoList.deployed();
    },
    render: async()=>{

        // Prevent double render
        if (App.loading) {
            return
        }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Tasks
      await App.renderTasks()
  
      // Update loading state
      App.setLoading(false)
    },

    renderTasks: async () => {
        // Load the total task count from the blockchain
        const taskCount = await App.todoList.taskCount()
        const $taskTemplate = $('.taskTemplate')

        // Render out each task with a new task template
        for (var i = 1; i <= taskCount; i++) {
        // Fetch the task data from the blockchain
        const task = await App.todoList.tasks(i)
        const taskId = task[0].toNumber()
        const taskContent = task[1]
        const taskCompleted = task[2]

        // Create the html for the task
        const $newTaskTemplate = $taskTemplate.clone()
        $newTaskTemplate.find('.content').html(taskContent)
        $newTaskTemplate.find('input')
                        .prop('name', taskId)
                        .prop('checked', taskCompleted)
                        .on('click', App.toggleCompleted)

        // Put the task in the correct list
        if (taskCompleted) {
            $('#completedTaskList').append($newTaskTemplate)
        } else {
            $('#taskList').append($newTaskTemplate)
        }

        // Show the task
        $newTaskTemplate.show()
        }
    },
    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }
      }
}
$(()=>{
    $(window).load(()=>{
        App.load();
    })
})
