import {SyntheticEvent, useState} from 'react';
import CircleLoader from 'react-spinners/CircleLoader';
import Modal from 'react-modal';
import {Book} from 'types';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useLocalStorage} from "@/lib/useLocalStorage";
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        width: '90%',
        height: '80%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '5px',
    },
};

export default function Home() {
    const defaultPrompt = "Briefly describe why this people might be interesting to someone who has experiences, educations or interests in computer. the people's title is {name}, with a educations: {educations}, and is in the experiences: {experiences}. Don't make up anything that wasn't given in this prompt and don't ask how you can help."
    const [isLoading, setIsLoading] = useState(false);
    const [loadedOnce, setLoadedOnce] = useState(false);
    const [query, setQuery] = useState('');
    const [userInterests, setUserInterests] = useLocalStorage("interest", defaultPrompt);
    const [recommendedItems, setRecommendedItems] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(undefined);
    const serverAssets = 'https://geosurvai.com/assets/images/';

    const [checked, setChecked] = useState(false);
    const handleChange = () => {
        setChecked(!checked);
    };

    const openModal = (item: object) => {
        // @ts-ignore
        setSelectedItem(item);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const getRecommendations = async (e: SyntheticEvent) => {
        e.preventDefault();

        // Check Inputs
        if (query === '') {
            alert("Please let us know what you'd like to learn!");
            return;
        }

        setIsLoading(true);
        if(checked) {

        }
        await fetch('/api/recommendations_talent_v3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                userInterests: checked ? userInterests : '',
            })
        })
            .then((res) => {
                //console.log(res)
                if (res.ok) return res.json();
            })
            .then((recommendations) => {
                //console.log(recommendations.data);
                setRecommendedItems(recommendations.data.Get.TalentV3);
            });

        setIsLoading(false);
        setLoadedOnce(true);
    };

    const getDefaultValue = (item: object, objKey: string) => {
        if (item === undefined) {
            return ("-");
        }

        if ((item[objKey] === undefined) || (item[objKey] === null)) {
            return ("-");
        }

        if (item[objKey] === "") {
            return ("-");
        }

        return (<>{item[objKey]}</>)
    }

    const getEducationsValue = (item: object, objKey: string) => {
        if (item === undefined) {
            return (<>-</>);
        }

        if ((item[objKey] === undefined) || (item[objKey] === null)) {
            return ("-");
        }

        if ((item[objKey] === "") || (item[objKey] === "{}")) {
            return ("-");
        }

        let obj_ = undefined;
        try {
            obj_ = JSON.parse(item[objKey].replaceAll("'", '"'));
        } catch (err) {
            return (
                <div className={"ml-5"}>
                    {item[objKey]}
                </div>
            )
        }

        return (
            <div className={"ml-5"}>
                <ol className={"list-decimal"}>
                    {Object.keys(obj_).map(key => (
                        <li key={key} className={"mb-1"}>
                            <div><i>Institute :</i> {obj_[key]['institution']}</div>
                            <div><i>Degree :</i> {obj_[key]['degree']}</div>
                            <div><i>Description :</i> {obj_[key]['description']}</div>
                            <div><i>Duration :</i> {obj_[key]['startDate']} - {obj_[key]['endDate']}</div>
                        </li>
                    ))}
                </ol>
            </div>
        );
    };

    const getSkillValue = (item: object, objKey: string) => {
        if (item === undefined) {
            return ("-");
        }

        if ((item[objKey] === undefined) || (item[objKey] === null)) {
            return ("-");
        }

        if ((item[objKey] === "") || (item[objKey] === "{}")) {
            return ("-");
        }

        let obj_ = undefined;
        try {
            obj_ = JSON.parse(item[objKey].replaceAll("'", '"'));
        } catch (err) {
            return (
                <div className={"ml-5"}>
                    {item[objKey]}
                </div>
            )
        }

        return (
            <div className={"ml-5"}>
                <ol className={"list-decimal"}>
                    {Object.keys(obj_).map(key => (
                        <li key={key} className={"mb-1"}>
                            <div>{obj_[key]}</div>
                        </li>
                    ))}
                </ol>
            </div>
        )
    }

    const getReformatDuration = (value: string) => {
        if ((value === undefined) || (value === null)) {
            return ("-");
        }

        const v = value.split("Â", 1);
        return (v.length === 1 ? v[0] : "-");
    }
    const getExperiencesValue = (item: object, objKey: string) => {
        if (item === undefined) {
            return (<>-</>);
        }

        if ((item[objKey] === undefined) || (item[objKey] === null)) {
            return ("-");
        }

        if ((item[objKey] === "") || (item[objKey] === "{}")) {
            return ("-");
        }

        let obj_ = undefined;
        try {
            obj_ = JSON.parse(item[objKey].replaceAll("'", '"'));
        } catch (err) {
            return (
                <div className={"ml-5"}>
                    {item[objKey]}
                </div>
            )
        }

        return (
            <div className={"ml-5"}>
                <ol className={"list-decimal"}>
                    {Object.keys(obj_).map(key => (
                        <li key={key} className={"mb-1"}>
                            <div><i>Company :</i> {obj_[key]['company']}</div>
                            <div><i>Location :</i> {obj_[key]['location']}</div>
                            <div><i>Position :</i> {getReformatDuration(obj_[key]['position'])}</div>
                            <div><i>Description :</i> {obj_[key]['description']}</div>
                            <div><i>Duration :</i> {obj_[key]['startDate']} - {obj_[key]['endDate']}</div>
                        </li>
                    ))}
                </ol>
            </div>
        );
    };

    return (
        <div className="h-screen flex flex-col justify-between bg-gray-100">

            <Modal
                ariaHideApp={false}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className="flex justify-between">
                    <h3 className="mt-2 text-lg font-semibold text-gray-700">
                    </h3>
                    <Button
                        className="hover:font-bold rounded hover:bg-gray-700 p-2 w-20 hover:text-white "
                        onClick={closeModal}
                    >
                        Close
                    </Button>
                </div>
                <div>
                    <div className='flex justify-center py-10'>
                        <div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={serverAssets + selectedItem?.image}
                                alt={"Thumbnail of the talent " + selectedItem?.name}
                                className="w-64 rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="mt-2 mb-1 text-2xl font-semibold text-gray-700 text-center">
                            {selectedItem?.name}
                        </h3>
                        <h3 className="mt-2 mb-1 text-md text-gray-700 text-center">
                            {selectedItem?.label}
                        </h3>
                        <div className={"mb-1"}>
                            <div className="font-bold text-2xl">Email :</div>
                            {getDefaultValue(selectedItem, "email")}
                        </div>
                        <div className={"mb-1"}>
                            <div className="font-bold text-2xl">Connection :</div>
                            {getDefaultValue(selectedItem, "connections")}
                        </div>
                        <div className={"mb-1"}>
                            <div className="font-bold text-2xl">Follower :</div>
                            {getDefaultValue(selectedItem, "followers")}
                        </div>
                        <div className={"mb-1"}>
                            <div className="font-bold text-2xl">Sex :</div>
                            {getDefaultValue(selectedItem, "sex")}
                        </div>
                        <div className={"mb-1"}>
                            <div className="font-bold text-2xl">City :</div>
                            {getDefaultValue(selectedItem, "city")}
                        </div>
                        <div className={"mb-1"}>
                            <div className="font-bold text-2xl">Languages :</div>
                            {getSkillValue(selectedItem, "languages")}
                        </div>
                        <div className={"mb-1"}>
                            <div className="font-bold text-2xl">Educations :</div>
                            {getEducationsValue(selectedItem, "educations")}
                        </div>
                        <div className={"mb-1"}>
                            <div className="font-bold text-2xl">Skills :</div>
                            {getSkillValue(selectedItem, "skills")}
                        </div>
                        <div className={"mb-1"}>
                            <div className="font-bold text-2xl">Courses :</div>
                            {getSkillValue(selectedItem, "courses")}
                        </div>
                        <div className={"mb-1"}>
                            <div className="font-bold text-2xl">Publications :</div>
                            {getSkillValue(selectedItem, "publications")}
                        </div>
                        <div className={"mb-1"}>
                            <div className="font-bold text-2xl">Licenses :</div>
                            {getSkillValue(selectedItem, "licenses")}
                        </div>
                        <div className={"mb-1"}>
                            <div className="font-bold text-2xl">Experiences :</div>
                            {getExperiencesValue(selectedItem, "experiences")}
                        </div>
                        <div className={"mb-1"}>
                            <div className="font-bold text-2xl">Projects :</div>
                            {getSkillValue(selectedItem, "projects")}
                        </div>
                        <div>
                            <div className="font-bold text-2xl">Summary :</div>
                            {getDefaultValue(selectedItem, "summary")}
                        </div>
                        <div>
                            <div className="font-bold text-2xl">About :</div>
                            {getDefaultValue(selectedItem, "about")}
                        </div>
                    </div>

                </div>
            </Modal>
            <div className="mb-auto py-10 px-4 bg-gray-100">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-black font-bold mb-6 text-center">
                        Talent Recommendations
                    </h1>

                    <form
                        id="recommendation-form"
                        className="mb-10"
                        onSubmit={getRecommendations}
                    >
                        <div className="mb-4">
                            <label
                                htmlFor="favorite-books"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                What would you like to get a talent recommendation on?
                            </label>
                            <Input
                                type="text"
                                id="favorite-books"
                                name="favorite-books"
                                placeholder="Find someone with ..."
                                className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                }}
                            />
                            <div>
                                <label className="block w-full py-2">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={handleChange}
                                    />
                                    <span className="px-4 py-2 shadow-sm ">
                Use Custom Prompt
                  </span>
                                </label>
                            </div>

                            {(process.env.NEXT_PUBLIC_COHERE_CONFIGURED && checked) && (
                                <>
                                    <label
                                        htmlFor="interests-input"
                                        className="block text-gray-700 font-bold mb-2 pt-4"
                                    >
                                        Your experiences, educations or interests
                                    </label>
                                    <textarea
                                        rows={5}
                                        id="interests-input"
                                        name="interests"
                                        placeholder="Tell us about your hobbies and interests, comma separated..."
                                        className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                                        value={userInterests}
                                        onChange={(e) => {
                                            setUserInterests(e.target.value);
                                        }}
                                    />
                                    <div>
                                        DB COLUMN LIST : sex, connections, followers, about, experiences, educations, licenses, skills, projects,
                                        publications, courses, languages, interests, name, label, summary, email, city, countryCode
                                    </div>
                                </>
                            )}

                        </div>
                        <Button className="bg-black text-white w-full rounded-md hover:bg-gray-800 hover:text-white"
                                disabled={isLoading} type="submit" variant="outline">
                            Get Recommendations
                        </Button>

                    </form>

                    {isLoading ? (
                        <div className="w-full flex justify-center h-60 pt-10">
                            <CircleLoader
                                color={'#000000'}
                                loading={isLoading}
                                size={100}
                                aria-label="Loading"
                                data-testid="loader"
                            />
                        </div>
                    ) : (
                        <>
                            {loadedOnce ? (
                                <>
                                    <h2 className="text-2xl font-bold mb-4 text-center">
                                        Recommended Talents
                                    </h2>
                                    <div
                                        id="recommended-books"
                                        className="flex overflow-x-scroll pb-10 hide-scroll-bar"
                                    >
                                        {/* <!-- Recommended books dynamically added here --> */}
                                        <section className="container mx-auto mb-12">
                                            <div className="flex flex-wrap -mx-2">
                                                {recommendedItems.map((item: Book) => {
                                                    return (
                                                        <div key={item.email}
                                                             className="w-full md:w-1/3 px-2 mb-4 animate-pop-in">
                                                            <div className="bg-white p-6 flex items-center flex-col">
                                                                <div className='flex justify-between w-full'>
                                                                    <h3 className="text-xl font-semibold mb-4 line-clamp-1">{item.name}</h3>
                                                                    {/*{process.env.NEXT_PUBLIC_COHERE_CONFIGURED && book._additional.generate.error != "connection to Cohere API failed with status: 429" && (*/}
                                                                    {/*  <Popover>*/}
                                                                    {/*    <PopoverTrigger asChild>*/}
                                                                    {/*      <Button*/}
                                                                    {/*        className='rounded-full p-2 bg-black cursor-pointer w-10 h-10'>✨</Button>*/}
                                                                    {/*    </PopoverTrigger>*/}
                                                                    {/*    <PopoverContent*/}
                                                                    {/*      className="w-80 h-80 overflow-auto">*/}
                                                                    {/*      <div>*/}
                                                                    {/*        <p className='text-2xl font-bold'>Why*/}
                                                                    {/*          you&apos;ll like this book:</p>*/}
                                                                    {/*        <br/>*/}
                                                                    {/*        <p>{book._additional.generate.singleResult}</p>*/}
                                                                    {/*      </div>*/}
                                                                    {/*    </PopoverContent>*/}
                                                                    {/*  </Popover>*/}
                                                                    {/*)}*/}

                                                                </div>
                                                                <div className='w-48'>
                                                                    <img
                                                                        src={serverAssets + item['image']}
                                                                        alt={"Thumbnail of the talent " + item['name']}
                                                                        className="w-full h-full rounded-lg shadow-lg"
                                                                    />
                                                                </div>
                                                                <p className="mt-4 text-gray-500 line-clamp-1">{item.label}</p>
                                                                <div className='flex'>
                                                                    <Button
                                                                        className="bg-black text-white w-full rounded-md hover:bg-gray-800 hover:text-white mt-1"
                                                                        type="submit" variant="outline" onClick={() => {
                                                                        openModal(item)
                                                                    }}>
                                                                        Learn More
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    );
                                                })}
                                            </div>
                                        </section>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full flex justify-center h-60 pt-10"></div>
                            )}

                        </>
                    )}
                </div>


            </div>

            <footer className="justify-center items-center bg-gray-600 text-white h-20 flex flex-col">
                <div>
                    Made with ❤️ by &nbsp;<a href="https://waviv.com" target="_blank"
                                             className="underline text-blue-200">waviv.com</a></div>
            </footer>
        </div>
    );
}
