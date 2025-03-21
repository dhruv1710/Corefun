import { ethers } from "ethers"

function List({ toggleCreate, fee, provider, factory }) {
  async function listHandler(form) {
    const name = form.get("name")
    const ticker = form.get("ticker")

    const signer = await provider.getSigner()
    
    const transaction = await factory.connect(signer).create(name, ticker, { value: fee })
    await transaction.wait()

    toggleCreate()
  }

  return (
                    
  
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 z-50 modal-overlay ${toggleCreate ? "opacity-100" : "opacity-0"}`}>
      <div className={`bg-white rounded-lg p-8 shadow-xl max-w-md w-full mx-4 transition-all duration-300 transform ${toggleCreate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">List New Token</h2>

          <div className="bg-gray-100 p-3 rounded-md">
            <p>Fee: {ethers.formatUnits(fee, 18)} ETH</p>
          </div>

          <form action={listHandler} className="space-y-4">
            <input 
              type="text" 
              name="name" 
              placeholder="name" 
              required 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text" 
              name="ticker" 
              placeholder="ticker" 
              required 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between pt-2">
              <button 
                type="submit" 
                className="btn--fancy px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                [ list ]
              </button>
              <button 
                type="button" 
                onClick={toggleCreate} 
                className="btn--fancy px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                [ cancel ]
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default List;