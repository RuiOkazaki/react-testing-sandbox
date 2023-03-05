import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react"

import { NativeFetch } from "~/components/NativeFetch"
import { ErrorBoundary } from "~/test-utils/ErrorBoundary"

const pokemons = [
  {
    id: "UG9rZW1vbjowMDE=",
    image: "https://img.pokemondb.net/artwork/bulbasaur.jpg",
    name: "Bulbasaur",
    __typename: "Pokemon"
  },
  {
    id: "UG9rZW1vbjowMDI=",
    image: "https://img.pokemondb.net/artwork/ivysaur.jpg",
    name: "Ivysaur",
    __typename: "Pokemon"
  }
]
const WrappedNativeFetch = ({ size }: { size: number }) => {
  return (
    <ErrorBoundary>
      <NativeFetch size={size} />
    </ErrorBoundary>
  )
}

const noDataPokemonsMock = () =>
  new Promise((resolve) => {
    resolve({
      ok: true,
      status: 200,
      json: async () => ({ data: { pokemons: [] } })
    })
  })
const dataPokemonsMock = () =>
  new Promise((resolve) => {
    resolve({
      ok: true,
      status: 200,
      json: async () => ({ data: { pokemons } })
    })
  })
const statusErrorPokemonMock = () =>
  new Promise((resolve) => {
    resolve({
      ok: false,
      status: 400,
      json: async () => ({ data: { pokemons } })
    })
  })

describe("NativeFetch", () => {
  afterAll(() => {
    ;(global.fetch as jest.Mock).mockClear()
  })
  test("render:loding", async () => {
    // mockImplementation:
    // mock関数が呼ばれた時の処理を作成する
    global.fetch = jest.fn().mockImplementation(dataPokemonsMock)
    const { asFragment } = render(<WrappedNativeFetch size={5} />)
    screen.getByText("loading...")
    expect(asFragment()).toMatchSnapshot()
    // waitForElementToBeRemoved: 引数に指定した要素がDOMから削除されるまで待つ
    await waitForElementToBeRemoved(() => screen.getByText("loading..."))
  })
  test("render:pokemons", async () => {
    global.fetch = jest.fn().mockImplementation(dataPokemonsMock)
    const { asFragment } = render(<WrappedNativeFetch size={5} />)
    screen.getByText("loading...")
    await waitForElementToBeRemoved(() => screen.getByText("loading..."))
    expect(asFragment()).toMatchSnapshot()
  })
  test("render:no pokemon", async () => {
    global.fetch = jest.fn().mockImplementation(noDataPokemonsMock)
    const { asFragment } = render(<WrappedNativeFetch size={0} />)
    // waitFor: 引数に指定した関数がtruesyを返すまで待つ
    await waitFor(() => screen.getByText("no pokemon"))
    expect(asFragment()).toMatchSnapshot()
  })
  test("error", async () => {
    global.fetch = jest.fn().mockImplementation(statusErrorPokemonMock)
    const spy = jest.spyOn(console, "error")
    spy.mockImplementation(() => void 0)
    render(<WrappedNativeFetch size={5} />)
    await waitFor(() => screen.getByText("http status: 400"))
    spy.mockRestore()
  })
})
