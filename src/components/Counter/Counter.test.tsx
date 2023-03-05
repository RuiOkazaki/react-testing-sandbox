import { fireEvent, render, screen } from "@testing-library/react"

import { Counter } from "./"

describe("Counter", () => {
  test("render", () => {
    // asFragmentとは、renderした結果を返す
    const { asFragment, getByText } = render(<Counter />)
    // snapshotを作成する
    expect(asFragment()).toMatchSnapshot()
    // 画面に表示されているか
    getByText("Count: 0")
  })
  test("click:count", () => {
    render(<Counter />)
    const button = screen.getByText("Increment")
    fireEvent.click(button)
    fireEvent.click(button)
    screen.getByText("Count: 2")
  })
})
