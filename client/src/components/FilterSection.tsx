import { useState } from "react";
import { URLSearchParamsInit } from "react-router"

function FilterButton({id, filterValue, filterActive, filterType, setFilterType, onFilterActive, onFilterApplied}: {id: string, filterValue: string[], filterActive: boolean, filterType: string, setFilterType: (value: string) => void, onFilterActive: (value: boolean) => void, onFilterApplied: (arg: URLSearchParamsInit) => void}) {
    // if other filter becomes active, deselect this filter
    if (filterActive && (document.getElementById(id)?.classList.contains("selected") || filterType != "button"))
    {
        document.getElementById(id)?.classList.remove("selected")
    }
    
    function handleClick() {
        setFilterType("button")

        const buttonElement = document.getElementById(id);
        if (buttonElement?.classList.contains("selected"))
        {
            onFilterActive(false);
            onFilterApplied({})
            buttonElement?.classList.remove("selected")
        }
        else
        {
            onFilterActive(true);
            onFilterApplied({ status: filterValue })
            buttonElement?.classList.add("selected")
        }
        
    }
    
    return (
        <button className="clickable" id={id} type="button" onClick={handleClick}>{id}</button>
    )
}

function SearchBar({searchText, onSearchTextChange, filterActive, onFilterActive, filterType, setFilterType, onFilterApplied}: {searchText: string, onSearchTextChange: (value: string) => void, filterActive: boolean, filterType: string, setFilterType: (value: string) => void, onFilterActive: (value: boolean) => void, onFilterApplied: (arg: URLSearchParamsInit) => void}) {
    // if other filter becomes active, clear the search bar
    if (filterActive && filterType != "search")
    {
        onSearchTextChange("")
    }

    function handleSearchTextChange(value: string) {
        onSearchTextChange(value)
        setFilterType("search")
        
        if (value.length <= 0)
        {
            onFilterActive(false)
            onFilterApplied({})
        }
        else
        {
            onFilterActive(true)
            onFilterApplied({ search: [value] })
        }
    }

    return (
        <form>
            <input type="text" 
            value={searchText} onChange={(e) => handleSearchTextChange(e.target.value)} 
            placeholder="Search by name, print name, or ID" />
        </form>
    )
}

export function FilterSection({filterButtons, onFilterApplied}: {filterButtons: {name: string, filter: string[]}[], onFilterApplied: (arg: URLSearchParamsInit) => void}) {
    const [filterActive, setFilterActive] = useState(false);
    const [filterType, setFilterType] = useState('');
    const [searchText, setSearchText] = useState('');

    const buttonGroup: JSX.Element[] = [];
    filterButtons.forEach((buttonItem) => {
        buttonGroup.push(
        <FilterButton
            key={buttonItem.name} id={buttonItem.name} filterValue={buttonItem.filter} filterActive={filterActive} filterType={filterType} setFilterType={setFilterType} onFilterActive={setFilterActive} onFilterApplied={onFilterApplied} />
        );
    })
    
    const clearFilter = () => {
        setFilterActive(false)
        onFilterApplied({});

        filterButtons.forEach((buttonItem) => {
            document.getElementById(buttonItem.name)?.classList.remove("selected");
        });

        setSearchText('')
    }

    return (
        <div className="filter-area">
            <h4>Filter</h4>
            <div className="filters-container">
                {buttonGroup}
                {filterActive && <span className="material-symbols-outlined clickable" onClick={clearFilter}>close</span>}
            </div>
            <form>
                <SearchBar 
                    searchText={searchText} 
                    onSearchTextChange={setSearchText}
                    filterActive={filterActive}
                    filterType={filterType} 
                    setFilterType={setFilterType}
                    onFilterActive={setFilterActive}
                    onFilterApplied={onFilterApplied}
                    />
                {filterActive && <span className="material-symbols-outlined clickable" onClick={clearFilter}>close</span>}
            </form>
        </div>     
    )
}