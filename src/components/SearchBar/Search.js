import React, {
  Component,
  useState,
  useEffect,
  useRef
} from "react"
import {SearchBarWrap} from './SearchBarWrap'
import Select, {components} from 'react-select'
import AsyncCreatableSelect from 'react-select/async-creatable'
import RadioFilter from '../FiltersBar/RadioFilter'
import {CloseCrossIco, HamburgerIco, MagnifyGlassIco, TopicStarIco} from '../../style/Icons'
import {searchByZavyTags} from '../../zavyApi'
import { withGlobalState } from 'react-globally'
import vars from '../../vars'

const maxPreDefTopics = 3
const maxUserCreatedTopics = 1

const SearchHooks = props => {
  const [countPreDefTopics, setCountPreDefTopics] = useState(0)
  const [countUserCreatedTopics, setUserCreatedTopics] = useState(0)
  const [chosenTopics, setChosenTopics] = useState([])

  const handleOnChange = (valuesList, actions) => {
    let searchStringNew = ''
    let searchTagsNew   = ''

    if(valuesList){

      // Extract the first Created value
      const {value:searchString=''} = valuesList.filter(({__isNew__=false})=>__isNew__).shift() || {}
      searchStringNew = searchString

      // Extract tags
      let searchTags = valuesList.filter(({__isNew__=false})=>!__isNew__).map(({value})=>value[0] || '')
      searchTagsNew = searchTags.slice(0,3).map(v=>`"${v}"`).join('|')
      // console.log('searchTagsNew: ',searchTagsNew)

      setCountPreDefTopics(valuesList.filter(({__isNew__ = false}) => !__isNew__).length)
      setUserCreatedTopics(valuesList.filter(({__isNew__ = false}) => !!__isNew__).length)
      setChosenTopics(valuesList.map(({value})=>value[0]))

    } else {
      setCountPreDefTopics(0)
      setUserCreatedTopics(0)
      setChosenTopics([])
    }

    props.setGlobalState({
      [vars.filter__SearchString]: searchStringNew,
      [vars.filter__SearchTags]: searchTagsNew,
    })

  }

  // Main Container
  const ValueContainer   = props => {
    return (
      <>
        <components.ValueContainer  {...props}>
          <MagnifyGlassIco className={'loupe-ico'} />
          {props.children}
        </components.ValueContainer>
      </>
    );
  };

  // ValueContainer - Chosen Tags / CustomSearch
  const MultiValueContainer = props => {
    const {data:{__isNew__=false}, data} = props
    return (
      <components.MultiValueContainer {...props}>
        { __isNew__
          ? <span style={{}}>..</span>
          : <TopicStarIco className={'star-ico'} />
        }
        {props.children}
      </components.MultiValueContainer>
    )
  }

  // Cross icon - Remove all options
  const MultiValueRemove = props => {
    return (
      <components.MultiValueRemove {...props}>
        <CloseCrossIco/>
      </components.MultiValueRemove>
    )
  }

  const MenuList = props => {
    return (
      <components.MenuList {...props}>
        {props.children}
      </components.MenuList>
    )
  }

  // Predefined Tag
  const Option = props => {
    const {data:{__isNew__=false}} = props
    return (
      <>
        <components.Option {...props}>
          { __isNew__
            ? <MagnifyGlassIco className={'loupe-ico created-option'}/>
            : <TopicStarIco className={'star-ico'} />
          }
          {props.children}
        </components.Option>
      </>
    )
  }

  // Max User-created Tags
  const isValidNewOption = (inputValue, selectValue) => {
    return inputValue!=='' && countUserCreatedTopics < maxUserCreatedTopics
  }

  const promiseOptions = inputValue => {
    return searchByZavyTags(inputValue)
      .then(({tags, my_tags})=>{
        return [
          {
            label: 'ZAVY DEFINED TOPICS (Maximum 3 items)',
            options:
              tags
                .filter(([value])=> ! chosenTopics.includes(value) )
                .map(v=>(
                  {
                    value: v,
                    label: v,
                    isDisabled: countPreDefTopics >= maxPreDefTopics
                  }))
          },
          {
            label: 'MY TOPICS',
            options:
              my_tags
                .filter(([value])=> ! chosenTopics.includes(value) )
                .map(v=>(
                  {
                    value: v,
                    label: v,
                    isDisabled: countPreDefTopics >= maxPreDefTopics
                  }))
          },


        ]
      })
  }

  // CreateLabel
  const formatCreateLabel = val => {
    return val
  }

  // Posts/Comments filter
  function useOutsideAlerter(ref, act) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          // alert("You clicked outside of me!");
          act()
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, act]);
  }
  function OutsideAlerter(props) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, props.act);

    return <div ref={wrapperRef}>{props.children}</div>;
  }
  const DropDownSubMenu = (props) => {

    const [isOpened, changeState] = useState(false)
    return (
      <div className={'dropdown-sub-menu'}>
        <div
          className={'ico'}
          onClick={()=>{changeState( !isOpened )}}
        >
          <HamburgerIco className={'hamburger-ico'+ (isOpened ? ' opened':'')} />
        </div>

        <div
          style={{display: (isOpened ? 'block':'none')}}
        >
          <OutsideAlerter
            act={()=>{
              if(isOpened){
                changeState(false)
              }
            }}
          >
            <RadioFilter
              id={'search-by'}
              title={'SEARCH BY'}
              list={['Posts', 'Comments', 'All']}
              defValue={'Posts'}
            />
          </OutsideAlerter>
        </div>


      </div>
    )
  }
  const Control = props => {
    return (
      <>
        <components.Control  {...props}>
          {props.children}
        </components.Control >
        {/*<DropDownSubMenu />*/}
      </>
    );
  }

  return (
    <SearchBarWrap>

      <AsyncCreatableSelect
        // defaultMenuIsOpen
        isMulti
        // cacheOptions
        loadOptions={promiseOptions}
        defaultOptions
        onChange={handleOnChange}
        // onInputChange={handleInputChange}
        className="search-bar-custom"
        classNamePrefix="rs"
        placeholder={'Zavy Topic Search...'}
        formatCreateLabel={formatCreateLabel}
        createOptionPosition={'first'}
        hideSelectedOptions
        isValidNewOption={isValidNewOption}
        components={{
          ValueContainer,
          MultiValueContainer,
          // MultiValueLabel,
          MultiValueRemove,
          MenuList,
          Option,
          Control
        }}
      />

    </SearchBarWrap>

  )

}

export default withGlobalState(
  React.memo(SearchHooks, ()=>true) // Analog of shouldComponentUpdate
)
