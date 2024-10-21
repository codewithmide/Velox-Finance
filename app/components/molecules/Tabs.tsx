type propsType = {
    options: string[],
    active: string
    select: (option: string) => void
}

const SortingTab = ({ options, active, select }: propsType) => {
    return (
        <div className="bg-[#404040] rounded-[30px] p-2">
            {
                options.map((option: string) => (
                    <button onClick={() => select(option)} className={`p-3 md:w-[120px] w-[70px] rounded-[24px] text-white md:text-[14px] text-[12px] ${active === option ? "bg-[#2C2C2C] active-tab font-medium" : ""}`}>
                        {option}
                    </button>
                )
                )
            }
        </div>

    );
}

export default SortingTab;