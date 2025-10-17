import { STATUS } from './data.ts'

// Order State Machine/Pattern
// purpose: manages the order process flow by controlling the logic of transitioning the order status
// States: Pending, PaymentRequired, InQueue, Processing, Completed, Delivered, Denied

// Context: Order
export class AsyncOrder {
    private id: string;
    private firstName: string;
    private lastName: string;
    private printName: string;
    private currentState: AsyncOrderState;
    private previousState: AsyncOrderState;
    
    private isProcessingAction: boolean;

    constructor(id: string, firstName: string, lastName: string, printName: string)
    {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.printName = printName;

        // set initial state
        this.currentState = new AsyncPendingState(this, STATUS.Pending);
        this.isProcessingAction = false;

        this.previousState = this.currentState;
    }

    getId()
    {
        return this.id;
    }

    getFirstName()
    {
        return this.firstName;
    }

    getLastName()
    {
        return this.lastName;
    }
    
    getPrintName()
    {
        return this.printName;
    }

    getCurrentState()
    {
        return this.currentState;
    }

    getPreviousState()
    {
        return this.previousState;
    }

    // transition state
    setState(state: AsyncOrderState)
    {
        this.previousState = this.currentState;
        this.currentState = state;

        console.log(`Order ${this.id} state changed to ${state.getName()}`);
    }

    // resume state
    setStateByStatus(status: string)
    {
        switch (status)
        {
            case STATUS.PaymentRequired:
                this.currentState = new AsyncPaymentRequiredState(this, STATUS.PaymentRequired);
                this.previousState = new AsyncPendingState(this, STATUS.Pending);
                break;
            case STATUS.InQueue:
                this.currentState = new AsyncInQueueState(this, STATUS.InQueue);
                this.previousState = new AsyncPaymentRequiredState(this, STATUS.PaymentRequired);
                break;
            case STATUS.Processing:
                this.currentState = new AsyncProcessingState(this, STATUS.Processing);
                this.previousState = new AsyncInQueueState(this, STATUS.PaymentRequired);
                break;
            case STATUS.Completed:
                this.currentState = new AsyncCompletedState(this, STATUS.Completed);
                this.previousState = new AsyncProcessingState(this, STATUS.Processing);
                break;
            default:
                this.currentState = new AsyncPendingState(this, STATUS.Pending);
                this.previousState = this.currentState;
                break;
        }
    }

    // helper method to prevent concurrent state changes
    async performAction(actionFn: () => void)
    {
        if (this.isProcessingAction)
        {
            console.log(`Order ${this.id} is already processing an action. Please wait.`);
            return false;
        }

        this.isProcessingAction = true;
        
        try
        {
            const result = await actionFn();
            return result;
        }
        finally
        {
            this.isProcessingAction = false;
        }
    }

    async accept()
    {
        return this.performAction(() => this.currentState.acceptOrder());
    }

    async deny()
    {
        return this.performAction(() => this.currentState.denyOrder());
    }

    async retry()
    {
        return this.performAction(() => this.currentState.retryOrder());
    }
}

// States: 
class AsyncOrderState {
    private order: AsyncOrder
    private name: string

    constructor(order: AsyncOrder, name: string)
    {
        this.order = order;
        this.name = name;
    }

    async acceptOrder()
    {
        throw new Error("Method acceptOrder not implemented")
        return false;
    }

    async denyOrder()
    {
        throw new Error("Method denyOrder not implemented")
        return false;
    }

    async retryOrder()
    {
        throw new Error("Method retryOrder not implemented")
        return false;
    }

    getOrder()
    {
        return this.order;
    }

    getName()
    {
        return this.name;
    }
}

// Pending
class AsyncPendingState extends AsyncOrderState {
    async acceptOrder()
    {
        console.log(`Processing approval for order ${this.getOrder().getId()}`)

        try
        {
            // API call to update order status
            // await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`Approval successful for order ${this.getOrder().getId()}`);

            this.getOrder().setState(new AsyncPaymentRequiredState(this.getOrder(), STATUS.PaymentRequired))
            return true;
        }
        catch (error)
        {
            console.error(`Approval failed for order ${this.getOrder().getId()}`, error);
            return false;
        }
    }

    async denyOrder() 
    {
        console.log(`Denying order ${this.getOrder().getId()}`)

        try
        {
            // API call to cancel order
            // await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`Order ${this.getOrder().getId()} cancelled successfully`);

            this.getOrder().setState(new AsyncDeniedState(this.getOrder(), STATUS.Denied))
            return true;
        }
        catch
        {
            console.error(`Failed to cancel order ${this.getOrder().getId()}`);
            return false;
        }
    }
}

// PaymentRequired
class AsyncPaymentRequiredState extends AsyncOrderState 
{
    async acceptOrder()
    {
        console.log(`Processing payment for order ${this.getOrder().getId()}`)

        try
        {
            // API call to update order status
            // await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`Payment successful for order ${this.getOrder().getId()}`);

            this.getOrder().setState(new AsyncInQueueState(this.getOrder(), STATUS.InQueue))
            return true;
        }
        catch (error)
        {
            console.error(`Payment failed for order ${this.getOrder().getId()}`, error);
            return false;
        }
    }

    async denyOrder() 
    {
        console.log(`Denying order ${this.getOrder().getId()}`)

        try
        {
            // API call to cancel order
            // await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`Order ${this.getOrder().getId()} cancelled successfully`);

            this.getOrder().setState(new AsyncDeniedState(this.getOrder(), STATUS.Denied))
            return true;
        }
        catch
        {
            console.error(`Failed to cancel order ${this.getOrder().getId()}`);
            return false;
        }
    }
}

// InQueue
class AsyncInQueueState extends AsyncOrderState 
{
    async acceptOrder()
    {
        console.log(`Order ${this.getOrder().getId()} added to queue and ready for processing`)

        try
        {
            // API call to update order status
            // await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`Order ${this.getOrder().getId()} is successfully being processed`);

            this.getOrder().setState(new AsyncProcessingState(this.getOrder(), STATUS.Processing))
            return true;
        }
        catch (error)
        {
            console.error(`Order ${this.getOrder().getId()} failed to start processing`, error);
            return false;
        }
    }

    async denyOrder() 
    {
        console.log(`Denying order ${this.getOrder().getId()}`)

        try
        {
            // API call to cancel order
            // await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`Order ${this.getOrder().getId()} cancelled successfully`);

            this.getOrder().setState(new AsyncDeniedState(this.getOrder(), STATUS.Denied))
            return true;
        }
        catch
        {
            console.error(`Failed to cancel order ${this.getOrder().getId()}`);
            return false;
        }
    }
}

// Processing
class AsyncProcessingState extends AsyncOrderState 
{
    async acceptOrder()
    {
        console.log(`Order ${this.getOrder().getId()} is being processed`)

        try
        {
            // API call to update order status
            // await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`Order ${this.getOrder().getId()} is completed`);

            this.getOrder().setState(new AsyncCompletedState(this.getOrder(), STATUS.Completed))
            return true;
        }
        catch (error)
        {
            console.error(`Processing failed for order ${this.getOrder().getId()}`, error);
            return false;
        }
    }

    async denyOrder() 
    {
        console.log(`Denying order ${this.getOrder().getId()}`)

        try
        {
            // API call to cancel order
            // await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`Order ${this.getOrder().getId()} cancelled successfully`);

            this.getOrder().setState(new AsyncInQueueState(this.getOrder(), STATUS.InQueue))
            return true;
        }
        catch
        {
            console.error(`Failed to cancel order ${this.getOrder().getId()}`);
            return false;
        }
    }
}

// Completed
class AsyncCompletedState extends AsyncOrderState 
{
    async acceptOrder()
    {
        console.log(`Order ${this.getOrder().getId()} is ready for delivery`)

        try
        {
            // API call to update order status
            // await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`Order ${this.getOrder().getId()} is delivered`);

            this.getOrder().setState(new AsyncDeliveredState(this.getOrder(), STATUS.Delivered))
            return true;
        }
        catch (error)
        {
            console.error(`Payment failed for order ${this.getOrder().getId()}`, error);
            return false;
        }
    }

    async denyOrder() 
    {
        console.log(`Denying order ${this.getOrder().getId()}`)

        try
        {
            // API call to cancel order
            // await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`Order ${this.getOrder().getId()} cancelled successfully`);

            this.getOrder().setState(new AsyncInQueueState(this.getOrder(), STATUS.InQueue))
            return true;
        }
        catch
        {
            console.error(`Failed to cancel order ${this.getOrder().getId()}`);
            return false;
        }
    }
}

// Delivered
class AsyncDeliveredState extends AsyncOrderState
{
    async acceptOrder()
    {
        console.log(`Order ${this.getOrder().getId()} is already delivered`)

        return false;
    }

    async denyOrder() 
    {
        console.log(`Cannot cancel order ${this.getOrder().getId()}: Order already delivered`)

        return false;
    }
}

// Denied
class AsyncDeniedState extends AsyncOrderState 
{
    async acceptOrder()
    {
        console.log(`Cannot accept order ${this.getOrder().getId()}: Order already cancelled`)
        return false;
    }

    async denyOrder() 
    {
        console.log(`Cannot deny order ${this.getOrder().getId()}: Order already cancelled`);
        return false;
    }

    async retryOrder()
    {
        console.log(`Move to previous state: ${this.getOrder().getPreviousState()}`)

        try
        {
            // API call to update order status
            // await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`Retry successful for order ${this.getOrder().getId()}`);

            this.getOrder().setState(this.getOrder().getPreviousState());
            return true;
        }
        catch (error)
        {
            console.error(`Retry failed for order ${this.getOrder().getId()}`, error);
            return false;
        }

        return true;
    }
}