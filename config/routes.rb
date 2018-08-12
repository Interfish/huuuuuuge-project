Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'welcome#index'
  resource :session, only: [:create, :destroy]
  get :birthday, to: 'birthday#index'
  get :cake, to: 'birthday#cake'
  resources :photos
end
