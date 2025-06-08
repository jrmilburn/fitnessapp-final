export default function ActivityModal({ handleAdd, title, setTitle, type, setType }) {

    return (
        <div className="fixed inset-0 w-full h-full bg-black/20 z-[10000]">
            <form className="absolute w-[250px] bg-white p-4 rounded z-20 left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">

                <h2>Add a new activity</h2>
                <div className="flex flex-col gap-2">
                    <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 border-black/20 rounded"
                    />

                    <input 
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border p-2 border-black/20 rounded"
                    />

                    <button onClick={() => handleAdd()}>
                        Add
                    </button>
                </div>

            </form>
        </div>
    )

}