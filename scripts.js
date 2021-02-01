const Modal ={
    open(){

        document.querySelector('.modal-overlay')
        .classList.add('active')

        //Abrir Modal

        //Adicionar a class active ao modal
        
    },
    close(){


        document.querySelector('.modal-overlay')
        .classList.remove('active')
        //fechar o modal
        //remover a class active do modal
   
    }
}
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finance:transaction')) ||
        [

        ]
    },
    set(transaction){
        localStorage.setItem("dev.finance:transaction" ,
        JSON.stringify(transaction))
    }
} 



// eu preciso somar as entradas 
//depois eu preciso somar as saídas
//remover das entradas o valor das saídas
//assim, eu terei o total  

const Transaction = {
    all: Storage.get(),

    add(transaction){

        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)
        App.reload()
    },
    
    
    incomes(){

        //somar todas entrada
        let income = 0;

        //pegar todas  a trasaçoes
        //para cada transaçao
        Transaction.all.forEach(transaction =>{

            // se ela  for maior que zero
            if(transaction.amount > 0 ){
                //somar a uma variavel e retornar a variavel
                income += transaction.amount
            } 
            
        })

        

        return income;

    },
    exepenses(){
        
        //somar as saídas
        let expense = 0;

        //pegar todas  a trasaçoes
        //para cada transaçao
       Transaction.all.forEach(transaction =>{

            // se ela  for menor que zero
            if(transaction.amount < 0 ){
                //somar a uma variavel e retornar a variavel
                expense += transaction.amount
            } 
            
        })

        

        return expense;

    },
    total(){
        //entradas - saídas
        return Transaction.incomes() + Transaction.exepenses()

    }
} 

// Substituir os dados do HTML com os dados do JS

const DOM = {
    TransactionsConteiner:document.querySelector('#data-table tbody'),

    

    addTransaction(transaction, index){
        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHtmlTransaction(transaction, index)
        tr.dataset.index = index
        

        DOM.TransactionsConteiner.appendChild(tr)
    },


    innerHtmlTransaction(transaction, index){
        const CSSClass = transaction.amount > 0 ? "income":
        "expense"

        
        const amount = Utils.formatCurrency(transaction.amount) 

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSClass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transações">
        </td>
        
        `

        return html
    },


    upadateBalance(){
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.exepenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())

        

        

    },

    clearTrasactions(){
        DOM.TransactionsConteiner.innerHTML = ""
    }
}




const Utils = {

    formatAmount(value){
        value = Number(value) * 100
        
        return value
    },
    formatDate(date){
        const splitteDate = date.split("-")
        return`${splitteDate[2]}/${splitteDate[1]}/${splitteDate[0] }`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""


        value = String(value).replace(/\D/g , "") // removendo caractere especial

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR" , {
            style: "currency", 
            currency: "BRL"
        })

        return signal  + value



    }
}

const Form = {

    description:document.querySelector('input#description'),
    amount:document.querySelector('input#amount'),
    date:document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,


        }
    },

  
    validadeFields(){
        const { description, amount, date } = Form.getValues()


        if(
            description.trim() === "" || 
            amount.trim() === "" ||
            date.trim() ===  ""
        ){
            throw new Error("Por favor, preencha todos os campos")
        }
    },
    formatValues () {
        let { description, amount, date } = Form.getValues()

        console.log(description)

        amount = Utils.formatAmount(amount)
        console.log(amount)


        date = Utils.formatDate(date)
        console.log(date)

        return{
            description,
            amount,
            date
        }
    },

    saveTrasaction(transaction){
        Transaction.add(transaction)
    },
    clearFilds(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
        
    },




    submit(event){
        event.preventDefault()


        try {
                
            // verificar se todas as informaçoes foram preenchidas
            Form.validadeFields()
            //formatar os dados para salvar
            const transaction = Form.formatValues()
            //salvar 
            Form.saveTrasaction(transaction)
            //apagar os dados do formulario
            Form.clearFilds()
            //modal feche
            Modal.close()
            //atualizar a aplicaçao 
            
            
        } catch (error) {
            alert("Por favor, preencha todos os campos")
        }
        
        


    }
}







const App = {
    init(){
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.upadateBalance()

        Storage.set(Transaction.all)
        
        

    },
    reload(){
        DOM.clearTrasactions()
        App.init()
    },
}

App.init()




